import React, { useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import api from '../../../config'
import { Dropdown } from 'primereact/dropdown'
import { Messages } from 'primereact/messages'

export default function EditAbsence(props) {
  const [sites, setSites] = React.useState([])
  const [data, setData] = React.useState({
    absenceName: props.source.absence_name,
    siteId: props.source.site_id,
    startDate: new Date(props.source.absence_start_date),
    endDate: new Date(props.source.absence_end_date),
    mandatory: props.source.mandatory
  })
  const msgs = useRef('null')
  const fetchSites = async () => {
    try {
      const response = await fetch(`${api.apiRequest}/getAbsenceSites`, {
        credentials: 'include'
      })
      const data = await response.json()
      const rows = data.data.rows
      const modifiedData = rows.map((item) => ({
        label: item.site_name,
        value: item.id,
        site: item.site_name,
        country: item.country_name,
        isarchived: item.isarchived
      }))
      setSites(modifiedData)
    } catch (err) {
      console.error('Failed to fetch sites:', err)
    }
  }

  useEffect(() => {
    fetchSites()
  }, [])

  const onChange = (key) => (e) => setData({ ...data, [key]: e.target.value })

  const editAbsence = async () => {
    try {
      const body = data
      let message = ''
      const requiredFields = [
        'absenceName',
        'siteId',
        'startDate',
        'endDate',
        'mandatory'
      ]
      const hasEmptyFields = requiredFields.some((field) => !data[field])

      if (hasEmptyFields) {
        message = 'Field are missing Please insert required data'
        return msgs.current.show([
          {
            sticky: false,
            severity: 'error',
            summary: '',
            detail: message,
            closable: true
          }
        ])
      }
      if (!/^[A-Za-z0-9' ']*$/.test(data.absenceName)) {
        message = 'the absence name can be english charcters and numbers only'
        return msgs.current.show([
          {
            sticky: false,
            severity: 'error',
            summary: '',
            detail: message,
            closable: true
          }
        ])
      }
      if (data.absenceName.length > 20 || data.absenceName.length < 1) {
        message =
          'the absence name length should be between 1 and 20 characters'
        return msgs.current.show([
          {
            sticky: false,
            severity: 'error',
            summary: '',
            detail: message,
            closable: true
          }
        ])
      }

      if (data.startDate > data.endDate) {
        message = 'Start date cannot be after end date'
        return msgs.current.show([
          {
            sticky: false,
            severity: 'error',
            summary: '',
            detail: message,
            closable: true
          }
        ])
      }
      await fetch(`${api.apiRequest}/EditAbsence/${props.source.absence_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      })
      if (body == null) {
        return 'you must to insert data'
      }
      props.updateState()
      props.onSubmit()
    } catch (err) {
      throw new Error('failed to connect to the server')
    }
  }

  return (
    <div
      className="card flex justify-content-center"
      style={{
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        alignItems: 'center'
      }}
    >
      <InputText
        id="AbsenceName"
        value={data.absenceName}
        name="AbsenceName"
        placeholder="Absence Name"
        onChange={onChange('absenceName')}
      />

      <br />
      <Dropdown
        value={data.siteId}
        onChange={onChange('siteId')}
        options={sites}
        optionLabel="label"
        optionValue="value"
        placeholder="Select a site"
        filter
        className="w-full md:w-14rem"
      />
      <br />
      <Calendar
        id="icon"
        value={data.startDate}
        onChange={onChange('startDate')}
        showIcon
        name="startDate"
        placeholder="start date"
        dateFormat="yy-mm-dd"
        style={{ width: '208px' }}
      />

      <br />
      <Calendar
        id="icon"
        value={data.endDate}
        onChange={onChange('endDate')}
        showIcon
        name="endDate"
        placeholder="end date"
        dateFormat="yy-mm-dd"
        style={{ width: '208px' }}
      />
      <br />
      <br />
      <span className="p-float-label">
        <Dropdown
          inputId="dd-city"
          value={data.mandatory}
          onChange={onChange('mandatory')}
          options={[{ mandatory: 'mandatory' }, { mandatory: 'optional' }]}
          optionLabel="mandatory"
          optionValue="mandatory"
          className="w-full md:w-14rem"
        />

        <label htmlFor="dd-city">Mandatory/optional</label>
      </span>
      <br />
      <br />
      <Button
        id="add"
        label="edit Absence"
        icon="pi pi-check"
        autoFocus
        onClick={editAbsence}
      />
      <Messages ref={msgs} />
    </div>
  )
}
