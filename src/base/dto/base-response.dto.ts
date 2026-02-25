export class BaseResponseDto<T> {
    status : boolean = true;
    message : string = '';
    payload : any = null;
}