import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import log from './logUtils.js'
import fs from 'fs/promises'

let fireStore: Firestore = new Firestore()

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
    fireStore = getFirestore()
  }

  /**
   * isVerified Function
   *
   * @summary Check if the Discord User has linked with Polytoria Community Verify
   *
   * @param { string } discordUserID Targetted user ID
   * @returns { Promise<Boolean> } Is user verified
   */
  public static async isVerified (discordUserID: string): Promise<boolean> {
    const usersRef = fireStore.collection('Users').doc(discordUserID)
    const doc = await usersRef.get()
    if (!doc.exists) {
      return false
    } else {
      return true
    }
  }

  /**
   * setVerified Function
   *
   * @summary Set User Verify state to Verified
   *
   * @param { string } discordUserID Targetted user ID
   * @param { string } polyUserID Targetted polytoria user ID
   */
  public static async setVerified (discordUserID: string, polyUserID: string): Promise<void> {
    const usersRef = fireStore.collection('Users').doc(discordUserID)
    await usersRef.set({
      DiscordUserID: discordUserID,
      PolytoriaUserID: polyUserID
    })
  }
}
