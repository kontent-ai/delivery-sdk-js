export namespace WorkflowModels {

    export class WorkflowStep {

        public id!: string;
        public name!: string;
        public transitionsTo!: string[];

        constructor(data: {
            id: string,
            name: string,
            transitionsTo: string[]
        }) {
            Object.assign(this, data);
        }
    }

    export interface IPublishOrSchedulePublishData {
        /**
         * ISO-8601 formatted date/time. Example: 2019-01-31T11:00:00+01:00
         */
        scheduled_to?: string;
    }

}
