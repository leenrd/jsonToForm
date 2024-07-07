import { cx } from "@/lib/utils";
import React from "react";

type Props = React.ComponentPropsWithRef<"span">;
export const RequiredStar = React.forwardRef<HTMLSpanElement, Props>(
  (props, ref) => {
    return (
      <span
        ref={ref}
        {...props}
        className={cx("font-bold text-red-500", props.className)}
      >
        *
      </span>
    );
  }
);
RequiredStar.displayName = "RequiredStar";
