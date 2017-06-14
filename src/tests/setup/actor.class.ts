import { ContentItem, TextField, AssetsField } from '../../../lib';

export class Actor extends ContentItem {
  public firstName: TextField;
  public lastName: TextField;
  public photo: AssetsField;

  constructor() {
    super({
      resolver: (fieldName: string) => {
        if (fieldName === 'first_name') {
          return 'firstName'; // binds 'first_name' response from Kentico cloud to 'firstName' property of this class
        }
        if (fieldName === 'last_name') {
          return 'lastName';
        }
      }
    })
  }

  public getFullName(): string {
    return `${this.firstName.text} ${this.lastName.text}`;
  }
}