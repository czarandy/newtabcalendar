import styled from 'styled-components';

const Button = styled.button`
  outline: 0;
  border: 0;
  cursor: pointer;
  background-color: var(--overlay-background);
  &:hover {
    background-color: var(--highlight-background);
  }
  color: var(--primary-color);
  padding: 8px 8px 9px;
  border-radius: 4px;
  font-family: system-ui, sans-serif;
  line-height: 1;
  display: flex;
  align-items: center;
`;

export default Button;
