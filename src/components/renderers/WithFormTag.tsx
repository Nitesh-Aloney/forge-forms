import type { DOMAttributes, FC, PropsWithChildren } from 'react';

type TWithFormTagProps = { onSubmit: DOMAttributes<HTMLFormElement>['onSubmit']; withFormTag?: boolean } & PropsWithChildren;

const WithFormTag: FC<TWithFormTagProps> = ({ children, onSubmit, withFormTag = true }) => {
  if (withFormTag) return <form onSubmit={onSubmit}>{children}</form>;
  return children;
};

export default WithFormTag;
