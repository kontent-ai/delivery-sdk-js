import { KenticoCloudAngular2SampleAppPage } from './app.po';

describe('kentico-cloud-angular2-sample-app App', () => {
  let page: KenticoCloudAngular2SampleAppPage;

  beforeEach(() => {
    page = new KenticoCloudAngular2SampleAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
