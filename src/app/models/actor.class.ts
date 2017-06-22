import { ContentItem, Fields } from '../../../lib';

export class Actor extends ContentItem {
  public firstName: Fields.TextField;
  public lastName: Fields.TextField;
  public photo: Fields.AssetsField;

  constructor() {
    super({
      propertyResolver: (fieldName: string) => {
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