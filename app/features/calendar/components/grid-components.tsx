import { forwardRef } from "react";

import type { ComponentPropsWithoutRef } from "react";
import type { VirtuosoGridProps } from "react-virtuoso";

const GridList = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={style}
      className="flex flex-wrap border-box border-r border-gray-200 dark:border-gray-700"
    >
      {children}
    </div>
  ),
);

const GridItem = ({ children, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div
    {...props}
    className="block h-20 content-stretch box-border border-l border-b border-gray-200 dark:border-gray-700 w-[calc(100%/7)]"
  >
    {children}
  </div>
);

export const GridComponents: VirtuosoGridProps<Date, undefined>["components"] =
  {
    List: GridList,
    Item: GridItem,
  };
