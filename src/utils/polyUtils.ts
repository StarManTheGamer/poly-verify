import axios from 'axios'

export default class polyUtils {
  public static async getUserInfoFromID (username: string): Promise<any> {
    const response = await axios.get('https://api.polytoria.com/v1/users/getbyusername?username=' + username, {
      validateStatus: () => true
    })

    return response
  }
}
