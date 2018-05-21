import { TrackingClient } from '../../lib';

describe('Client', () => {

  const projectId = 'xxx';

  const client = new TrackingClient({
      projectId: projectId
  });

  const any = {} as any;

  const newSessionUrl = client.recordNewSession(any).getUrl();
  const newActivityUrl = client.recordCustomActivity(any, any).getUrl();
  const newContactUrl = client.createContactProfile(any).getUrl();

  it(`Verifies new session url`, () => expect(newSessionUrl.toLowerCase()).toEqual(`https://engage-ket.kenticocloud.com/v3/track/${projectId}/session`));

  it(`Verifies new activity url`, () => expect(newActivityUrl.toLowerCase()).toEqual(`https://engage-ket.kenticocloud.com/v3/track/${projectId}/activity`));

  it(`Verifies new contact profile url`, () => expect(newContactUrl.toLowerCase()).toEqual(`https://engage-ket.kenticocloud.com/v3/track/${projectId}/contact`));


});

