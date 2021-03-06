import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { GraphicalIcon } from '../../../../app/javascript/components/common/GraphicalIcon'

test('icon renders correctly', async () => {
  const { queryByRole } = render(<GraphicalIcon icon="reputation" />)

  await waitFor(() => expect(queryByRole('presentation')).toBeInTheDocument())
})
