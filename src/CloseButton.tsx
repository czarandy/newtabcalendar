import styled from 'styled-components';

const Button = styled.button`
  border: 0;
  background: none;
  cursor: pointer;
  padding: 4px;
  opacity: 0.8;
  filter: var(--black-icon-filter);
  :hover {
    opacity: 1;
  }
`;

function CloseButton(props: {onClick: () => unknown}): React.ReactElement {
  return (
    <Button {...props}>
      <i className="fas fa-times" />
    </Button>
  );
}

export default CloseButton;
