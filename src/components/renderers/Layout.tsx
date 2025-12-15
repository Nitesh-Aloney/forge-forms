import { type FC, memo } from 'react';
import type { TRowElement, TSectionElement } from '@/schemas/form-entites/layout';
import type { BaseRendererProps } from '@/types';
import Row from './Row';
import Section from './Section';

export type TLayoutProps = BaseRendererProps & {
  schema: TRowElement | TSectionElement;
};

/**
 * Layout Renderer Component
 *
 * A unified component for rendering different layout types (section, row, step)
 * based on the layoutType field in the schema.
 */
const Layout: FC<TLayoutProps> = ({ schema, path }) => {
  switch (schema.layoutType) {
    case 'section':
      return <Section path={path} schema={schema} />;
    case 'row':
      return <Row path={path} schema={schema} />;
    default:
      return null;
  }
};

export default memo(Layout);
