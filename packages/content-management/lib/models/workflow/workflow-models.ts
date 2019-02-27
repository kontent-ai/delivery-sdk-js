export namespace WorkflowModels {

    export class WorkflowStep {

        public id!: string;
        public name!: string;
        transitionsTo!: string[];

        constructor(data: {
            id: string,
            name: string,
            transitionsTo: string[]
        }) {
            Object.assign(this, data);
        }
    }

}
