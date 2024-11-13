import React from 'react'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'

type Props = {
    title: string,
    description: string,
    children?: React.ReactNode,
    footer?: React.ReactNode
}

const GlobalCard = ({title, children, description, footer}: Props) => {
  return (
    <Card className='bg-transparent mt-4 '>
        <CardHeader className='p-4'>
            <CardTitle className='text-md text-[#9d9d9d]'>{title}</CardTitle>
            <CardDescription>
                {description}
            </CardDescription>
        </CardHeader>
        {children && (
            <div className="pt-4">
            {children}
        </div>
        )}
        {footer && <CardFooter className='p-4'>{footer}</CardFooter>}
    </Card>
  )
}

export default GlobalCard