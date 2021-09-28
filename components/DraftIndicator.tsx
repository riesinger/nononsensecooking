import styled from "styled-components";

const StyledContainer = styled.div`
  border: 3px solid var(--color-primary);
  background: var(--color-primary-muted);
  border-radius: var(--rounded-lg);
  padding: 1rem 1.75rem;
  margin-bottom: 2rem;
`;

const DraftIndicator = () => {
  return (
    <StyledContainer>
      This recipe is a draft. Make sure to check back later, once this recipe is
      done!
    </StyledContainer>
  );
};

export default DraftIndicator;
