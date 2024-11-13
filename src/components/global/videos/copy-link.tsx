import { Links } from '@/components/icons';
import { Button } from '@/components/ui/button';
import React from 'react'
import { toast } from 'sonner';

type Props = {
    videoId: string;
    className?: string,
    variant?: 
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
}

const CopyLink = ({videoId, variant, className}: Props) => {
    const onCopyClipboard = () => {
        navigator.clipboard.writeText(
            `${process.env.NEXT_PUBLIC_HOST_URL}/preview/${videoId}`
        )
        return toast('Copied', {description: 'Link Successfully copied to clipboard'})
    }
  return (
    <Button variant={variant} onClick={onCopyClipboard} className={className}>
        <Links />
    </Button>
  )
}

export default CopyLink