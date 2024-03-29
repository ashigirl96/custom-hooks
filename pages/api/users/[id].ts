import { NextApiRequest, NextApiResponse } from 'next'
import { sampleUserData } from '../../../utils/sample-data'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      query: { id, party }
    } = req;
    if (Array.isArray(id)) {
        throw new Error('Cannot find user data')
    }

    const data = sampleUserData.find((user) => user.id === +id);
    if (!data) {
      throw new Error('Cannot find user data')
    }

    const result = {
      ...data,
      funny: party,
    };
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
