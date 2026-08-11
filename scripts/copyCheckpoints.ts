import { Disklet, justFiles, navigateDisklet } from 'disklet'

/**
 * Where `update-checkpoints` writes, and the iOS copy is made from. Exported so
 * prepack can tell when a checkpoint refresh has left the iOS copy stale.
 */
export const checkpointPath =
  'android/src/main/assets/co.electriccoin.zcash/checkpoint/mainnet'

const toPath = 'ios/ZCashLightClientKit/Resources/checkpoints/mainnet'

/**
 * Copies checkpoints over from the Android side to the iOS side.
 */
export async function copyCheckpoints(disklet: Disklet): Promise<void> {
  console.log('Copying checkpoints...')
  const fromDisklet = navigateDisklet(disklet, checkpointPath)
  const toDisklet = navigateDisklet(disklet, toPath)

  const files = justFiles(await fromDisklet.list())

  // A missing directory lists as empty, so an empty copy means a bad path:
  if (files.length === 0) throw new Error(`No checkpoints in ${checkpointPath}`)

  for (const file of files) {
    const text = await fromDisklet.getText(file)
    await toDisklet.setText(file, text)
  }
}
