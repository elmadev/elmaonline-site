import { useState } from 'react';
import styled from '@emotion/styled';
import { Column } from 'components/Containers';
import { Menu } from '@mui/icons-material';
import { Stepper as MuiStepper, Step, StepButton } from '@mui/material';
import type { StepperProps as MuiStepperProps } from '@mui/material';

type StepperProps = {
  steps: string[];
  orientation?: MuiStepperProps['orientation'];
  nonLinear?: boolean;
  hideable?: boolean;
  onClick?: (index: number) => void;
};

const Stepper = ({
  steps,
  orientation = 'horizontal',
  nonLinear = true,
  hideable = false,
  onClick,
}: StepperProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [hide, setHide] = useState(hideable);
  return (
    <Column ai="flex-end">
      {hideable && <Burger onClick={() => setHide(!hide)} />}
      {!hide && (
        <MuiStepper
          activeStep={activeStep}
          orientation={orientation}
          nonLinear={nonLinear}
        >
          {steps?.length > 0 &&
            steps.map((step, index) => (
              <Step key={step}>
                <StepButton
                  onClick={() => {
                    setActiveStep(index);
                    if (onClick) {
                      onClick(index);
                    }
                  }}
                >
                  {step}
                </StepButton>
              </Step>
            ))}
        </MuiStepper>
      )}
    </Column>
  );
};

const Burger = styled(Menu)`
  && {
    cursor: pointer;
    font-size: 2rem;
  }
`;

export default Stepper;
