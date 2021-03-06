import React from 'react'
import { ConversationList } from './inbox/ConversationList'
import { TextFilter } from './TextFilter'
import { Sorter } from './Sorter'
import { TrackFilter } from './inbox/TrackFilter'
import { useList } from '../../hooks/use-list'

export function Inbox({ tracksRequest, sortOptions, ...props }) {
  const [conversationsRequest, setFilter, setSort, setPage, setQuery] = useList(
    props.conversationsRequest
  )

  const setTrack = (track) => {
    setQuery({ track: track, page: 1 })
  }

  return (
    <div className="mentor-inbox">
      <TrackFilter request={tracksRequest} setTrack={setTrack} />
      <TextFilter
        filter={conversationsRequest.query.filter}
        setFilter={setFilter}
        id="conversation-filter"
        placeholder="Filter by student or exercise name"
      />
      <Sorter
        sortOptions={sortOptions}
        sort={conversationsRequest.query.sort}
        setSort={setSort}
        id="conversation-sorter-sort"
      />
      <ConversationList request={conversationsRequest} setPage={setPage} />
    </div>
  )
}
