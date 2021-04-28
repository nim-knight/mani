import { JsonObject, JsonProperty } from '@/core/json2typescript'
import File from './File';

@JsonObject('Directory')
export default class Directory {
  /** 应用名称 */
  @JsonProperty('name', String, true)
  public name = '/';

  public children: (Directory | File)[] =[]
}
