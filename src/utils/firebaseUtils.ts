import { initializeApp, cert } from 'firebase-admin/app'
import log from './logUtils.js'
import fs from 'fs/promises'

export default class firebaseUtils {
  /**
     * Init Function
     *
     * @summary Connect Application with firebase
     *
     * @example
     * import { init } from 'firebaseUtils.ts'
     *
     * init()
     */
  public static async init (): Promise<void> {
    const data: string = await fs.readFile('serviceAccountKey.json', 'utf-8')
    initializeApp({
      credential: cert(JSON.parse(data))
    })
    log.logSuccess('Firebase', 'Successfully Connected to firebase!')
  }
  
}
