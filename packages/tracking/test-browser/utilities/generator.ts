
export class GuidHelper {
    newGuid() {
       return 'xxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
           // tslint:disable-next-line:no-bitwise triple-equals
           const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
           return v.toString().slice(0, 16);
       });
   }

   testSid(): string {
       return '1234567812345678';
   }

   testUserId(): string {
    return '123456781234567810';
}
}

export let guidHelper = new GuidHelper();
