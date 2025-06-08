import { ComponentType, ReactNode } from 'react';

export const withWrappers = <P extends object>(
  Component: ComponentType<P>,
  wrappers: ComponentType<{ children?: ReactNode }>[]
): ComponentType<P> => {
  return wrappers.reduce(
    (WrappedComponent, Provider) =>
      ({ ...props }: any) =>
        (
          <Provider>
            <WrappedComponent {...props} />
          </Provider>
        ),
    Component
  );
};
