import { mdiMinus, mdiPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import styled from "styled-components";

const IconButton = styled.button`
  appearance: none;
  border: none;
  background: var(--color-background-alt);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: var(--rounded-full);
  width: 2.5rem;
  height: 2.5rem;
`;

const ChooserInputLine = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Servings = styled.span`
  font-size: 1.275rem;
`;

const Heading = styled.h5`
  font-weight: 500;
  font-size: 1.275rem;
`;

const StyledServingsChooser = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

interface Props {
  servings: number;
  onServingsChanged: (newServings: number) => void;
}

const ServingsChooser = ({ servings, onServingsChanged }: Props) => {
  const { t } = useTranslation("recipe");
  return (
    <StyledServingsChooser>
      <Heading>{t("servings")}</Heading>
      <ChooserInputLine>
        <IconButton
          onClick={function () {
            onServingsChanged(Math.max(1, servings - 1));
          }}
        >
          <Icon path={mdiMinus} size={1} title="Less servings" />
        </IconButton>

        <Servings>{servings}</Servings>
        <IconButton
          onClick={function () {
            onServingsChanged(servings + 1);
          }}
        >
          <Icon path={mdiPlus} size={1} title="More servings" />
        </IconButton>
      </ChooserInputLine>
    </StyledServingsChooser>
  );
};

export default ServingsChooser;
