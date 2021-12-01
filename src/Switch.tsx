import styled from 'styled-components';

const Label = styled.label`
  position: relative;
  display: block;
  float: right;
  left: 0px;
  width: 36px;
  height: 20px;
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #6664;
  transition: 0.4s;
  border: 1px solid white;
  border-radius: 12px;

  &:before {
    position: absolute;
    content: '';
    height: 12px;
    width: 12px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    box-shadow: 0 0 3px #0006;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  &:checked + ${Slider} {
    background-color: #3338;
  }
  &:checked + ${Slider}:before {
    transform: translateX(16px);
  }
  &:focus + ${Slider} {
    box-shadow: 0 0 3px #0002;
  }
`;

export default function Switch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => unknown;
}): React.ReactElement {
  return (
    <Label>
      <Input
        onChange={t => {
          onChange(t.target.checked);
        }}
        type="checkbox"
        checked={value}
      />
      <Slider />
    </Label>
  );
}
