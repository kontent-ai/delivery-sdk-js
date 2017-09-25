import { Observable } from 'rxjs/Rx';
import { AllTestObjects, Movie } from './models';

import { IDeliveryClient, ItemResponses, FieldModels, TaxonomyResponses, TypeResponses, IQueryConfig } from '../../lib';

class ObservableFactory {

    private readonly movieCodename: string = 'warrior';
    private readonly taxonomyCodename: string = 'movietype';
    private readonly typeCodename: string = 'movie';

    getAllTestObjects(client: IDeliveryClient, queryConfig?: IQueryConfig): Observable<AllTestObjects> {

        var allTestObjects: AllTestObjects = new AllTestObjects();

        if (!queryConfig){
            queryConfig = {};
        }

        return client.item<Movie>(this.movieCodename).queryConfig(queryConfig).get()
            .map(r => allTestObjects.item = r as ItemResponses.DeliveryItemResponse<Movie>)
            .flatMap(r => client.items().queryConfig(queryConfig).get())
            .map(r => allTestObjects.items  = r as ItemResponses.DeliveryItemListingResponse<Movie>)
            .flatMap(r => client.taxonomy(this.taxonomyCodename).queryConfig(queryConfig).get())
            .map(r => allTestObjects.taxonomy  = r as TaxonomyResponses.TaxonomyResponse)
            .flatMap(r => client.taxonomies().queryConfig(queryConfig).get())
            .map(r => allTestObjects.taxonomies  = r as TaxonomyResponses.TaxonomiesResponse)
            .flatMap(r => client.type(this.typeCodename).queryConfig(queryConfig).get())
            .map(r => allTestObjects.type  = r as TypeResponses.DeliveryTypeResponse)
            .flatMap(r => client.types().queryConfig(queryConfig).get())
            .map(r => allTestObjects.types  = r as TypeResponses.DeliveryTypeListingResponse)
            .map(() => allTestObjects);
    }
}

export var observableFactory = new ObservableFactory();



