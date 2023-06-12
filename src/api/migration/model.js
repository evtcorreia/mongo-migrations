import mongoose, { Schema } from 'mongoose'

const migrationSchema = new Schema({
  name: {
    type: String
  },
  status: {
    type: String
  },
  version: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

migrationSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      name: this.name,
      status: this.status,
      version: this.version,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Migration', migrationSchema)

export const schema = model.schema
export default model
