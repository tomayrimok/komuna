import styled from '@emotion/styled';
import { Button, HStack } from '@chakra-ui/react';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <HStack>
        <Button>Click me</Button>
        <Button>Click me</Button>
      </HStack>
    </StyledApp>
  );
}

export default App;
