export const DEMO_LOGIN_KEY = 'showcase-demo'

const AUTH_STORAGE_KEY = 'handlehq-showcase-authenticated'
const STATE_STORAGE_KEY = 'handlehq-showcase-state'
const SHOWCASE_REFERENCE_DATE = '2026-05-25T12:00:00.000Z'
const NETWORK_DELAY_MS = 140
const VALID_STATUSES = new Set(['new', 'reviewed', 'actioned', 'closed'])

const INITIAL_STATE = {
  tickets: [
    {
      id: 1048,
      user_id: 'sara@lunaatelier.pk',
      name: 'Sara Khan',
      request_type: 'New Project',
      details: 'Need three custom formal outfits for a bridal party with pastel embroidery options.',
      budget: 'PKR 180,000',
      timeline: 'Final fitting needed before June 14',
      status: 'reviewed',
      notes: 'Promising lead. Send pastel mood board and fitting slots.',
      created_at: '2026-05-25T09:10:00.000Z',
      updated_at: '2026-05-25T11:35:00.000Z',
    },
    {
      id: 1047,
      user_id: 'bilal@northviewrealty.pk',
      name: 'Bilal Ahmed',
      request_type: 'Appointment',
      details: 'Wants a Friday afternoon viewing for a three-bedroom apartment in DHA.',
      budget: 'PKR 32M ceiling',
      timeline: 'Viewing requested this Friday after 3pm',
      status: 'new',
      notes: '',
      created_at: '2026-05-25T08:25:00.000Z',
      updated_at: '2026-05-25T08:25:00.000Z',
    },
    {
      id: 1046,
      user_id: 'mariam@seasidecatering.pk',
      name: 'Mariam Faisal',
      request_type: 'Inquiry',
      details: 'Asked for buffet pricing for a 120-person mehndi event with vegetarian options.',
      budget: 'Still deciding',
      timeline: 'Event is in early July',
      status: 'actioned',
      notes: 'Quote draft is ready. Waiting on final menu confirmation.',
      created_at: '2026-05-24T13:15:00.000Z',
      updated_at: '2026-05-25T10:05:00.000Z',
    },
    {
      id: 1045,
      user_id: 'salman@coolairservices.pk',
      name: 'Salman Ali',
      request_type: 'Complaint',
      details: 'Customer reported repeat AC breakdown after last service visit and wants urgent follow-up.',
      budget: 'Covered under service warranty',
      timeline: 'Needs a technician today before 6pm',
      status: 'new',
      notes: 'Escalate if no technician is assigned by noon.',
      created_at: '2026-05-24T07:40:00.000Z',
      updated_at: '2026-05-24T09:05:00.000Z',
    },
    {
      id: 1044,
      user_id: 'amna@brightpathclinic.pk',
      name: 'Amna Yousaf',
      request_type: 'Meeting',
      details: 'Requested a strategy call about automating patient inquiry intake across WhatsApp and website chat.',
      budget: 'Open to a custom plan',
      timeline: 'Would like to meet next week',
      status: 'closed',
      notes: 'Converted to signed pilot. Moved to onboarding.',
      created_at: '2026-05-23T15:30:00.000Z',
      updated_at: '2026-05-24T16:20:00.000Z',
    },
    {
      id: 1043,
      user_id: 'daniyal@orbitstudio.pk',
      name: 'Daniyal Khan',
      request_type: 'New Project',
      details: 'Needs a fast brochure site refresh plus lead intake workflow for a product launch.',
      budget: 'PKR 350,000',
      timeline: 'Launch is in three weeks',
      status: 'reviewed',
      notes: '',
      created_at: '2026-05-22T12:05:00.000Z',
      updated_at: '2026-05-23T09:45:00.000Z',
    },
    {
      id: 1042,
      user_id: 'hiba@sunstrideenergy.pk',
      name: 'Hiba Noor',
      request_type: 'Inquiry',
      details: 'Asked whether solar consultation requests can be qualified automatically before a callback.',
      budget: 'Depends on package',
      timeline: 'Exploring options this month',
      status: 'closed',
      notes: 'Closed after sharing recorded demo and pricing deck.',
      created_at: '2026-05-20T10:50:00.000Z',
      updated_at: '2026-05-21T14:10:00.000Z',
    },
  ],
  events: [
    {
      id: 5012,
      source: 'admin',
      event_type: 'ticket_updated',
      status: 'info',
      summary: 'Ticket #1048 status changed from new to reviewed.',
      user_id: 'sara@lunaatelier.pk',
      ticket_id: 1048,
      request_id: null,
      payload: {
        status_changed: true,
        previous_status: 'new',
        current_status: 'reviewed',
        notes_updated: true,
      },
      created_at: '2026-05-25T11:35:00.000Z',
    },
    {
      id: 5011,
      source: 'email',
      event_type: 'ticket_created',
      status: 'success',
      summary: 'Ticket #1047 created from email conversation.',
      user_id: 'bilal@northviewrealty.pk',
      ticket_id: 1047,
      request_id: null,
      payload: {
        subject: 'Need to schedule a property viewing',
      },
      created_at: '2026-05-25T08:25:00.000Z',
    },
    {
      id: 5010,
      source: 'whatsapp',
      event_type: 'ticket_created',
      status: 'success',
      summary: 'Ticket #1046 created from WhatsApp conversation.',
      user_id: 'mariam@seasidecatering.pk',
      ticket_id: 1046,
      request_id: null,
      payload: {
        recipient: 'operations@seasidecatering.pk',
      },
      created_at: '2026-05-24T13:15:00.000Z',
    },
    {
      id: 5009,
      source: 'admin',
      event_type: 'ticket_updated',
      status: 'info',
      summary: 'Admin notes updated for ticket #1045.',
      user_id: 'salman@coolairservices.pk',
      ticket_id: 1045,
      request_id: null,
      payload: {
        status_changed: false,
        notes_updated: true,
      },
      created_at: '2026-05-24T09:05:00.000Z',
    },
    {
      id: 5008,
      source: 'whatsapp',
      event_type: 'extraction_followup',
      status: 'warning',
      summary: 'WhatsApp conversation needed one more clarification before logging.',
      user_id: 'amna@brightpathclinic.pk',
      ticket_id: null,
      request_id: null,
      payload: {
        missing_fields: ['timeline'],
      },
      created_at: '2026-05-23T15:05:00.000Z',
    },
    {
      id: 5007,
      source: 'admin',
      event_type: 'ticket_updated',
      status: 'success',
      summary: 'Ticket #1044 closed after pilot approval.',
      user_id: 'amna@brightpathclinic.pk',
      ticket_id: 1044,
      request_id: null,
      payload: {
        status_changed: true,
        previous_status: 'actioned',
        current_status: 'closed',
        notes_updated: true,
      },
      created_at: '2026-05-24T16:20:00.000Z',
    },
    {
      id: 5006,
      source: 'email',
      event_type: 'ticket_created',
      status: 'success',
      summary: 'Ticket #1043 created from email conversation.',
      user_id: 'daniyal@orbitstudio.pk',
      ticket_id: 1043,
      request_id: null,
      payload: {
        subject: 'Landing page + lead workflow needed',
      },
      created_at: '2026-05-22T12:05:00.000Z',
    },
    {
      id: 5005,
      source: 'system',
      event_type: 'health_check',
      status: 'success',
      summary: 'Daily showcase dataset refresh completed.',
      user_id: null,
      ticket_id: null,
      request_id: null,
      payload: {},
      created_at: '2026-05-22T06:00:00.000Z',
    },
  ],
  sessionsByUserId: {
    'sara@lunaatelier.pk': {
      status: 'ok',
      user_id: 'sara@lunaatelier.pk',
      ticket_created: true,
      turn_count: 6,
      created_at: '2026-05-25T09:02:00.000Z',
      updated_at: '2026-05-25T09:10:00.000Z',
      messages: [
        { role: 'user', content: 'Hi, I need three custom outfits for a bridal party next month.' },
        { role: 'assistant', content: 'Happy to help. What name should I put on the request?' },
        { role: 'user', content: 'Sara Khan.' },
        { role: 'assistant', content: 'Thanks, Sara. Do you already have a budget range in mind for the full set?' },
        { role: 'user', content: 'Around 180,000 rupees, and I need the final fitting before June 14.' },
        { role: 'assistant', content: 'Perfect, I have everything I need. Your request has been logged and the team will follow up with pastel options and fitting availability shortly.' },
      ],
    },
    'bilal@northviewrealty.pk': {
      status: 'ok',
      user_id: 'bilal@northviewrealty.pk',
      ticket_created: true,
      turn_count: 6,
      created_at: '2026-05-25T08:18:00.000Z',
      updated_at: '2026-05-25T08:25:00.000Z',
      messages: [
        { role: 'user', content: 'I want to book a viewing for a three-bedroom apartment in DHA.' },
        { role: 'assistant', content: 'Absolutely. What name should we attach to the viewing request?' },
        { role: 'user', content: 'Bilal Ahmed.' },
        { role: 'assistant', content: 'Thanks, Bilal. When would you ideally like to visit?' },
        { role: 'user', content: 'This Friday after 3pm. Budget is around 32 million.' },
        { role: 'assistant', content: 'Great, your viewing request is in. The team will confirm the available slot and next steps shortly.' },
      ],
    },
    'mariam@seasidecatering.pk': {
      status: 'ok',
      user_id: 'mariam@seasidecatering.pk',
      ticket_created: true,
      turn_count: 8,
      created_at: '2026-05-24T12:50:00.000Z',
      updated_at: '2026-05-24T13:15:00.000Z',
      messages: [
        { role: 'user', content: 'Can you quote catering for a mehndi of around 120 guests?' },
        { role: 'assistant', content: 'Of course. What name should I note on the request?' },
        { role: 'user', content: 'Mariam Faisal.' },
        { role: 'assistant', content: 'Thanks. Is this mainly a buffet setup, plated dinner, or something else?' },
        { role: 'user', content: 'Buffet, and we need vegetarian options too.' },
        { role: 'assistant', content: 'Noted. Do you have a budget range or event timing in mind yet?' },
        { role: 'user', content: 'Still deciding the budget, but it will be in early July.' },
        { role: 'assistant', content: 'That is enough for us to log it. The team will send menu options and pricing guidance shortly.' },
      ],
    },
    'salman@coolairservices.pk': {
      status: 'ok',
      user_id: 'salman@coolairservices.pk',
      ticket_created: true,
      turn_count: 6,
      created_at: '2026-05-24T07:33:00.000Z',
      updated_at: '2026-05-24T07:40:00.000Z',
      messages: [
        { role: 'user', content: 'Your technician visited yesterday but my AC stopped cooling again.' },
        { role: 'assistant', content: 'I am sorry about that. What name should I put on the complaint?' },
        { role: 'user', content: 'Salman Ali.' },
        { role: 'assistant', content: 'Thank you. How urgent is the follow-up visit for you?' },
        { role: 'user', content: 'Very urgent. I need someone here before 6pm today.' },
        { role: 'assistant', content: 'Understood. I have logged the complaint and flagged the urgency for the team.' },
      ],
    },
    'amna@brightpathclinic.pk': {
      status: 'ok',
      user_id: 'amna@brightpathclinic.pk',
      ticket_created: true,
      turn_count: 6,
      created_at: '2026-05-23T14:48:00.000Z',
      updated_at: '2026-05-23T15:30:00.000Z',
      messages: [
        { role: 'user', content: 'We want to automate patient inquiry handling on WhatsApp and website chat.' },
        { role: 'assistant', content: 'Sounds great. What name should I add to the request?' },
        { role: 'user', content: 'Amna Yousaf.' },
        { role: 'assistant', content: 'Thanks, Amna. Would you prefer a project brief or a meeting request?' },
        { role: 'user', content: 'A meeting next week would be best. Budget is open if the system fits.' },
        { role: 'assistant', content: 'Perfect. I have logged a meeting request and the team will reach out to schedule it.' },
      ],
    },
    'daniyal@orbitstudio.pk': {
      status: 'ok',
      user_id: 'daniyal@orbitstudio.pk',
      ticket_created: true,
      turn_count: 6,
      created_at: '2026-05-22T11:52:00.000Z',
      updated_at: '2026-05-22T12:05:00.000Z',
      messages: [
        { role: 'user', content: 'Need a quick landing page refresh plus better lead capture for a launch.' },
        { role: 'assistant', content: 'Happy to help. What name should we use on the request?' },
        { role: 'user', content: 'Daniyal Khan.' },
        { role: 'assistant', content: 'Thanks. Do you already have a budget and launch timing in mind?' },
        { role: 'user', content: 'Budget is 350,000 and we launch in three weeks.' },
        { role: 'assistant', content: 'Got it. The request is logged and the team will review the scope and timing with you.' },
      ],
    },
    'hiba@sunstrideenergy.pk': {
      status: 'ok',
      user_id: 'hiba@sunstrideenergy.pk',
      ticket_created: true,
      turn_count: 6,
      created_at: '2026-05-20T10:42:00.000Z',
      updated_at: '2026-05-20T10:50:00.000Z',
      messages: [
        { role: 'user', content: 'Can your system pre-qualify solar leads before our team calls them?' },
        { role: 'assistant', content: 'Definitely. What name should I note for the inquiry?' },
        { role: 'user', content: 'Hiba Noor.' },
        { role: 'assistant', content: 'Thanks, Hiba. Do you have a preferred rollout timeline or budget range yet?' },
        { role: 'user', content: 'Not yet. We are exploring this month.' },
        { role: 'assistant', content: 'That is enough to get started. The team will follow up with a walkthrough and next-step options.' },
      ],
    },
  },
}

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise(resolve => window.setTimeout(resolve, ms))
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value))
}

function readAuthState() {
  return window.localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

function writeAuthState(isAuthenticated) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, isAuthenticated ? 'true' : 'false')
}

function writeState(state) {
  window.localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state))
}

function seedState() {
  const seeded = deepClone(INITIAL_STATE)
  writeState(seeded)
  return seeded
}

function readState() {
  try {
    const raw = window.localStorage.getItem(STATE_STORAGE_KEY)
    if (!raw) return seedState()

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed?.tickets) || !Array.isArray(parsed?.events) || !parsed?.sessionsByUserId) {
      return seedState()
    }

    return parsed
  } catch {
    return seedState()
  }
}

function requireAuth() {
  if (!readAuthState()) {
    throw new Error('UNAUTHORIZED')
  }
}

function nextEventId(events) {
  return events.reduce((maxId, event) => Math.max(maxId, Number(event.id) || 0), 0) + 1
}

function sortTickets(tickets, sortField = 'created_at', orderDir = 'desc') {
  const field = sortField === 'updated_at' ? 'updated_at' : 'created_at'
  const direction = orderDir === 'asc' ? 1 : -1

  return [...tickets].sort((left, right) => {
    const leftValue = new Date(left[field] || 0).getTime()
    const rightValue = new Date(right[field] || 0).getTime()

    if (leftValue === rightValue) {
      return direction * (Number(left.id) - Number(right.id))
    }

    return direction * (leftValue - rightValue)
  })
}

function paginate(items, page, perPage) {
  const total = items.length
  const safePerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 20
  const totalPages = Math.max(1, Math.ceil(total / safePerPage))
  const safePage = Math.min(Math.max(1, page || 1), totalPages)
  const start = (safePage - 1) * safePerPage

  return {
    total,
    page: safePage,
    per_page: safePerPage,
    total_pages: totalPages,
    items: items.slice(start, start + safePerPage),
  }
}

function mondayStart(date) {
  const clone = new Date(date)
  clone.setUTCHours(0, 0, 0, 0)
  const day = clone.getUTCDay()
  const delta = day === 0 ? 6 : day - 1
  clone.setUTCDate(clone.getUTCDate() - delta)
  return clone
}

function computeSummary(tickets) {
  const referenceDate = new Date(SHOWCASE_REFERENCE_DATE)
  const weekStart = mondayStart(referenceDate).getTime()
  const todayKey = referenceDate.toISOString().slice(0, 10)

  const byStatus = {
    new: 0,
    reviewed: 0,
    actioned: 0,
    closed: 0,
  }

  let ticketsToday = 0
  let ticketsThisWeek = 0

  tickets.forEach(ticket => {
    if (byStatus[ticket.status] != null) {
      byStatus[ticket.status] += 1
    }

    const createdAt = new Date(ticket.created_at)
    if (createdAt.toISOString().slice(0, 10) === todayKey) {
      ticketsToday += 1
    }
    if (createdAt.getTime() >= weekStart) {
      ticketsThisWeek += 1
    }
  })

  return {
    open_tickets: byStatus.new,
    in_progress: byStatus.reviewed + byStatus.actioned,
    closed: byStatus.closed,
    total_tickets: tickets.length,
    tickets_today: ticketsToday,
    tickets_this_week: ticketsThisWeek,
    by_status: byStatus,
  }
}

function buildAdminEvent(ticket, previousTicket) {
  const statusChanged = previousTicket.status !== ticket.status
  const notesUpdated = (previousTicket.notes || '') !== (ticket.notes || '')

  let summary = `Ticket #${ticket.id} updated by admin.`
  if (statusChanged && notesUpdated) {
    summary = `Ticket #${ticket.id} status and notes updated by admin.`
  } else if (statusChanged) {
    summary = `Ticket #${ticket.id} status changed from ${previousTicket.status} to ${ticket.status}.`
  } else if (notesUpdated) {
    summary = `Admin notes updated for ticket #${ticket.id}.`
  }

  return {
    source: 'admin',
    event_type: 'ticket_updated',
    status: 'info',
    summary,
    user_id: ticket.user_id,
    ticket_id: ticket.id,
    request_id: null,
    payload: {
      status_changed: statusChanged,
      previous_status: previousTicket.status,
      current_status: ticket.status,
      notes_updated: notesUpdated,
    },
    created_at: ticket.updated_at,
  }
}

export async function loginAdmin(adminKey) {
  await delay()

  if ((adminKey || '').trim() !== DEMO_LOGIN_KEY) {
    throw new Error('UNAUTHORIZED')
  }

  writeAuthState(true)
  readState()
  return { status: 'ok', authenticated: true }
}

export async function getAdminSession() {
  await delay(90)
  readState()
  return { status: 'ok', authenticated: readAuthState() }
}

export async function logoutAdmin() {
  await delay(80)
  writeAuthState(false)
  return { status: 'ok', authenticated: false }
}

export async function getSummary() {
  requireAuth()
  await delay()

  const state = readState()
  return {
    status: 'ok',
    ...computeSummary(state.tickets),
  }
}

export async function getEvents(params = {}) {
  requireAuth()
  await delay()

  const state = readState()
  let events = [...state.events]

  if (params.source) {
    events = events.filter(event => event.source === params.source)
  }
  if (params.status) {
    events = events.filter(event => event.status === params.status)
  }

  const total = events.length
  const limit = Math.max(1, Number(params.limit) || 20)
  const offset = Math.max(0, Number(params.offset) || 0)

  return {
    status: 'ok',
    total,
    limit,
    offset,
    events: deepClone(events.slice(offset, offset + limit)),
  }
}

export async function getTickets(params = {}) {
  requireAuth()
  await delay()

  const state = readState()
  let tickets = [...state.tickets]

  if (params.status) {
    tickets = tickets.filter(ticket => ticket.status === params.status)
  }
  if (params.user_id) {
    tickets = tickets.filter(ticket => ticket.user_id === params.user_id)
  }

  tickets = sortTickets(tickets, params.sort, params.order)
  const paged = paginate(tickets, Number(params.page) || 1, Number(params.per_page) || 20)

  return {
    status: 'ok',
    total: paged.total,
    page: paged.page,
    per_page: paged.per_page,
    total_pages: paged.total_pages,
    tickets: deepClone(paged.items),
  }
}

export async function getTicket(id) {
  requireAuth()
  await delay()

  const ticketId = Number(id)
  const ticket = readState().tickets.find(record => record.id === ticketId)

  if (!ticket) {
    throw new Error('NOT_FOUND')
  }

  return deepClone(ticket)
}

export async function patchTicket(id, body = {}) {
  requireAuth()
  await delay()

  const ticketId = Number(id)
  const state = readState()
  const index = state.tickets.findIndex(record => record.id === ticketId)

  if (index < 0) {
    throw new Error('NOT_FOUND')
  }

  const current = state.tickets[index]
  const updated = {
    ...current,
    status: body.status ?? current.status,
    notes: body.notes ?? current.notes,
  }

  if (!VALID_STATUSES.has(updated.status)) {
    throw new Error('HTTP 400')
  }

  updated.notes = updated.notes == null ? '' : String(updated.notes)
  updated.updated_at = new Date().toISOString()

  state.tickets[index] = updated

  state.events = [
    { id: nextEventId(state.events), ...buildAdminEvent(updated, current) },
    ...state.events,
  ]

  writeState(state)
  return deepClone(updated)
}

export async function getSessionHistory(userId) {
  requireAuth()
  await delay()

  const session = readState().sessionsByUserId[userId]
  if (!session) {
    throw new Error('NOT_FOUND')
  }

  return deepClone(session)
}

export async function getHealth() {
  await delay(60)
  return { status: 'ok', mode: 'showcase' }
}

export async function resetDemoState() {
  await delay(100)
  const state = seedState()
  return {
    status: 'ok',
    ticket_count: state.tickets.length,
  }
}
