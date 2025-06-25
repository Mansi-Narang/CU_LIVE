import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

export function EventForm({ initialData, onSubmit, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    date: initialData?.date || "",
    time: initialData?.time || "",
    location: initialData?.location || "",
    price: initialData?.price?.replace("₹ ", "") || 0,
    description: initialData?.description || "",
    category: initialData?.category || "sports",
    capacity: initialData?.capacity || 100,
  })

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id.replace("event-", "")]: value,
    }))
  }

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      price: `₹ ${formData.price}`,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="event-title">Event Title</Label>
        <Input
          id="event-title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter event title"
          className="bg-[#2D1B48] border-purple-900/50"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="event-date">Date</Label>
          <Input
            id="event-date"
            value={formData.date}
            onChange={handleChange}
            type="text"
            placeholder="e.g. April 16"
            className="bg-[#2D1B48] border-purple-900/50"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="event-time">Time</Label>
          <Input
            id="event-time"
            value={formData.time}
            onChange={handleChange}
            type="text"
            placeholder="e.g. 7:30 PM"
            className="bg-[#2D1B48] border-purple-900/50"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="event-location">Location</Label>
        <Input
          id="event-location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter venue"
          className="bg-[#2D1B48] border-purple-900/50"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="event-price">Price (₹)</Label>
          <Input
            id="event-price"
            value={formData.price}
            onChange={handleChange}
            type="number"
            placeholder="0"
            className="bg-[#2D1B48] border-purple-900/50"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="event-capacity">Capacity</Label>
          <Input
            id="event-capacity"
            value={formData.capacity}
            onChange={handleChange}
            type="number"
            placeholder="100"
            className="bg-[#2D1B48] border-purple-900/50"
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="event-category">Category</Label>
        <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
          <SelectTrigger className="bg-[#2D1B48] border-purple-900/50">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-[#2D1B48] border-purple-900/50">
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="concert">Concert</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
            <SelectItem value="exhibition">Exhibition</SelectItem>
            <SelectItem value="festival">Festival</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="event-description">Description</Label>
        <Textarea
          id="event-description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter event description"
          className="bg-[#2D1B48] border-purple-900/50 min-h-[100px]"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="event-image">Upload Image</Label>
        <Input id="event-image" type="file" className="bg-[#2D1B48] border-purple-900/50" />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-purple-500 text-purple-300 hover:bg-purple-900/30 hover:text-white"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-[#CB202D] hover:bg-[#E03744] text-white">
          {isEditing ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
