import { Tab } from "@headlessui/react";
import { mdiGoogle } from "@mdi/js";
import Icon from "@mdi/react";
import clsx from "clsx";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import PocketBase, { AuthProviderInfo } from "pocketbase";
import { HTMLProps, useEffect, useState } from "react";
import Button from "../components/Button";
import FormGroup from "../components/FormGroup";
import Input from "../components/Input";

const AUTH_PROVIDERS: Record<string, { name: string; logo: string }> = {
  google: { name: "Google", logo: mdiGoogle },
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
};

const Card = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  const classes = clsx(
    "bg-zinc-200 dark:bg-zinc-800 shadow-md p-8 rounded-md",
    className
  );
  return <div className={classes} {...props} />;
};

const PanelContainer = ({ className, ...props }: HTMLProps<HTMLDivElement>) => {
  const classes = clsx("w-full max-w-xl mx-auto", className);
  return <div className={classes} {...props} />;
};

export default function AuthPage() {
  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [authProviders, setAuthProviders] = useState<AuthProviderInfo[]>([]);

  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_HOST);

  useEffect(() => {
    async function loadLinks() {
      const authMethods = await pb.collection("users").listAuthMethods();
      setAuthProviders(authMethods.authProviders);
    }
    loadLinks();
  }, []);

  async function onSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSigningIn(true);
    try {
      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);
      const { returnTo } = router.query;
      if (returnTo) {
        router.replace(`${decodeURIComponent(returnTo as string)}`);
      } else {
        router.replace(`/`);
      }
    } catch (e) {
      // TODO: Display the error to the user
      setSigningIn(false);
    }
  }

  function onOAuthSignIn(providerName: string) {
    return async function () {
      localStorage.setItem(
        "returnTo",
        (router.query.returnTo as string) || "/"
      );
      const redirectUrl = window.location.origin + "/oauth";
      const provider = authProviders.find((p) => p.name === providerName);
      localStorage.setItem("provider", JSON.stringify(provider));
      console.log(localStorage.getItem("provider"));
      router.push(provider.authUrl + redirectUrl);
    };
  }

  return (
    <div className="w-full px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab>Sign In</Tab>
          <Tab disabled>Create a new account</Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <PanelContainer>
              <Card>
                <h2>Sign In</h2>
                <form onSubmit={onSignIn}>
                  <FormGroup id="signin-email" label="Email">
                    <Input
                      type="mail"
                      name="email"
                      placeholder="your@e.mail"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup id="signin-password" label="Password">
                    <Input
                      type="password"
                      name="email"
                      placeholder="123456"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                  <Button loading={signingIn} type="submit">
                    Sign In
                  </Button>
                </form>
                {authProviders.length > 0 && (
                  <section className="mt-4">
                    <h3 className="mb-2">Or sign in with</h3>
                    {authProviders.map((provider) => (
                      <Button
                        key={provider.name}
                        leftIcon={
                          <Icon
                            size={0.75}
                            path={AUTH_PROVIDERS[provider.name].logo}
                          />
                        }
                        onClick={onOAuthSignIn(provider.name)}
                      >
                        {AUTH_PROVIDERS[provider.name].name}
                      </Button>
                    ))}
                  </section>
                )}
              </Card>
            </PanelContainer>
          </Tab.Panel>
          <Tab.Panel>
            <span>Sign Up</span>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
