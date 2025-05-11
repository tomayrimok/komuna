import React from 'react';
import { Sheet } from '@silk-hq/components';
import './sidebar.css';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

const Sidebar = ({ children, trigger, ...restProps }: Props) => {
  return (
    <Sheet.Root license="commercial" sheetRole="dialog" {...restProps} dir="ltr">
      <Sheet.Trigger>{trigger}</Sheet.Trigger>
      <Sheet.Portal>
        <Sheet.View
          className="sidebar-view"
          contentPlacement="right"
          swipeOvershoot={false}
          nativeEdgeSwipePrevention={true}
        >
          <Sheet.Backdrop />
          <Sheet.Content className="sidebar-content">{children}</Sheet.Content>
        </Sheet.View>
      </Sheet.Portal>
    </Sheet.Root>
  );
};

export { Sidebar };
