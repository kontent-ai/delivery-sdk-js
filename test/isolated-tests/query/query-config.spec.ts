import { IQueryConfig } from '../../../lib/interfaces/common/iquery.config';
import { IItemQueryConfig } from '../../../lib/interfaces/item/iitem-query.config';
import { Context, setup } from '../../setup';

describe('Query configurations', () => {

  const context = new Context();
  setup(context);

  it(`QueryConfig should set values properly`, () => {
    let queryConfig: IQueryConfig = { usePreviewMode: true, waitForLoadingNewContent: true };
    expect(queryConfig.usePreviewMode).toEqual(true);
    expect(queryConfig.waitForLoadingNewContent).toEqual(true);

    queryConfig = ({ usePreviewMode: false, waitForLoadingNewContent: false });
    expect(queryConfig.usePreviewMode).toEqual(false);
    expect(queryConfig.waitForLoadingNewContent).toEqual(false);
  });

  it(`ItemQuerConfig should set values properly`, () => {
    let queryConfig: IItemQueryConfig = { usePreviewMode: true, waitForLoadingNewContent: true };
    expect(queryConfig.usePreviewMode).toEqual(true);
    expect(queryConfig.waitForLoadingNewContent).toEqual(true);

    queryConfig = { usePreviewMode: false, waitForLoadingNewContent: false };
    expect(queryConfig.usePreviewMode).toEqual(false);
    expect(queryConfig.waitForLoadingNewContent).toEqual(false);
  });
});

