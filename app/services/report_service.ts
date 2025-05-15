import Report from '#models/report'
import type User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import drive from '@adonisjs/drive/services/main'
import type { ModelObject } from '@adonisjs/lucid/types/model'
import Papa from 'papaparse'

interface ExportCSVProps {
  data: ModelObject[]
  logger: HttpContext['logger']
  name: string
  user: User
  description: string
}
export default class ReportService {
  static async exportCSV({ data, name, logger, user, description }: ExportCSVProps) {
    logger.info(`Prepping to create CSV`)
    const csv = Papa.unparse(data, {})
    const csvBuffer = Buffer.from(csv)
    const csvFileRoute = `uploads/reports-docs/${name}-${Date.now()}.csv`

    logger.info(`Prepping to upload CSV`)
    await drive.use().put(csvFileRoute, csvBuffer)

    const url = await drive.use().getSignedUrl(csvFileRoute, { expiresIn: '1 hour' })

    logger.info(`Prepping to create report for CSV`)
    const fileDetails = {
      name: csvFileRoute,
      extname: 'csv',
      size: csvBuffer.length,
      mimeType: 'text/csv',
    }

    const newReport = await Report.create({
      name: fileDetails.name,
      description,
      userId: user.id,
      file: fileDetails,
      metadata: { url },
    })
    return newReport
  }
}
