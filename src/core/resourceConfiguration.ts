/**
 * Configuration for retrieving a resource.
 */
export class ResourceConfiguration {
  public url = '';
  public isScript = true;
  public attributes?: { [key: string]: string };
  public skip: () => boolean = () => { return false; };
}
