/**
 * Configuration for retrieving a resource.
 */
export class ResourceConfiguration {
  public url: string = '';
  public isScript: boolean = true;
  public attributes?: { [key: string]: string; };
  public skip: () => boolean = () => { return false; };
}
