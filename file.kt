import java.io.File
import java.util.zip.ZipInputStream

fun main(args: Array<String>) {
    val zipFilePath = args[0]
    val passwordListPath = args[1]
    val passwords = File(passwordListPath).readLines()

    for (password in passwords) {
        val input = ZipInputStream(File(zipFilePath).inputStream())
        try {
            input.setPassword(password)
            var entry = input.nextEntry
            while (entry != null) {
                entry = input.nextEntry
            }
            println("Password found: $password")
            break
        } catch (e: Exception) {
            // Password is incorrect, continue with next password
        } finally {
            input.close()
        }
    }
}

private fun ZipInputStream.setPassword(password: String) {
    val crc = crc
    val keys = LongArray(3)
    initKeys(password, keys)
    val decrypter = createZipCipher(keys)
    `in` = InflaterInputStream(decrypter, Inflater(true))
    crc.reset()
}
