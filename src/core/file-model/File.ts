import { JsonObject, JsonProperty } from '@/core/json2typescript'

@JsonObject('Directory')
export default class File {
  /** 应用名称 */
  @JsonProperty('name', String, true)
  public name = 'newFile';

  @JsonProperty('content', String, true)
  public content = ''

  @JsonProperty('base64', String, true)
  public base64 = ''
}
