import { FieldInterfaces} from './field-interfaces';
import { FieldType } from '../fields/field-type';
import { Fields} from './field-types';

import { IContentItem } from '../interfaces/item/icontent-item.interface';

export class FieldUtilities{

    getUrlSlugProperty(contentItem: IContentItem): Fields.UrlSlugField | null{
        if (!contentItem){
            return null;
        }

        var properties = Object.getOwnPropertyNames(contentItem);
        
        var urlSlugfield: Fields.UrlSlugField | null = null;

        properties.forEach(property => {
            // get field
            var field = contentItem[property] as FieldInterfaces.IField;

            if (!field){
                return;
            }

            if (!field.type){
                return;
            }

            if (field.type.toString() === FieldType.url_slug.toString()){
                urlSlugfield = field as Fields.UrlSlugField;
                return;
            }
        });

        return urlSlugfield;
    }
}