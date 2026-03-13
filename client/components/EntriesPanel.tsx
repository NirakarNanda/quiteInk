'use client'

export interface PageData {
    text: string
    pageNumber: number
}

export interface SavedEntry {
    _id: string
    title: string
    pages: PageData[]
    aiReply?: string
    createdAt: string
    updatedAt: string
}

interface EntriesPanelProps {
    entries: SavedEntry[]
    onClose: () => void
    onDelete: (id: string) => void
    onLoad: (entry: SavedEntry) => void
}

export default function EntriesPanel({ entries, onClose, onDelete, onLoad }: EntriesPanelProps) {

    const formatDate = (isoString: string) => {
        const d = new Date(isoString)
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December']
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
    }

    return (
        <div
            className="slide-in-right"
            style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: 'min(380px, 92vw)',
                background: 'linear-gradient(160deg, rgba(28,20,14,0.97), rgba(18,12,8,0.99))',
                borderLeft: '1px solid rgba(180,140,100,0.12)',
                zIndex: 50,
                display: 'flex', flexDirection: 'column',
                backdropFilter: 'blur(20px)',
            }}
        >
            {/* Header */}
            <div style={{
                padding: '24px 24px 18px',
                borderBottom: '1px solid rgba(180,140,100,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
                <div>
                    <div style={{
                        fontFamily: '"Special Elite", cursive',
                        fontSize: '0.6rem',
                        letterSpacing: '0.3em',
                        color: 'rgba(180,150,100,0.4)',
                        textTransform: 'uppercase',
                        marginBottom: '6px',
                    }}>Your writings</div>
                    <h2 style={{
                        fontFamily: '"Special Elite", cursive',
                        fontSize: '1.4rem',
                        color: 'rgba(240,232,210,0.85)',
                        letterSpacing: '0.05em',
                    }}>Saved Entries</h2>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(240,232,210,0.35)',
                        fontSize: '1.2rem', padding: '4px',
                        lineHeight: 1,
                        transition: 'color 0.2s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.color = 'rgba(240,232,210,0.7)')}
                    onMouseOut={e => (e.currentTarget.style.color = 'rgba(240,232,210,0.35)')}
                >✕</button>
            </div>

            {/* Count */}
            {entries.length > 0 && (
                <div style={{
                    padding: '10px 24px',
                    fontFamily: '"Courier Prime", monospace',
                    fontSize: '0.7rem',
                    color: 'rgba(180,150,100,0.3)',
                    borderBottom: '1px solid rgba(180,140,100,0.07)',
                }}>
                    {entries.length} {entries.length === 1 ? 'entry' : 'entries'} saved
                </div>
            )}

            {/* Entries list */}
            <div style={{
                flex: 1, overflowY: 'auto',
                padding: '12px 16px',
            }}>
                {entries.length === 0 ? (
                    <div style={{
                        padding: '48px 24px',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: '2rem', marginBottom: '16px', opacity: 0.3 }}>✍</div>
                        <p style={{
                            fontFamily: '"Lora", serif',
                            fontStyle: 'italic',
                            fontSize: '0.9rem',
                            color: 'rgba(240,232,210,0.25)',
                            lineHeight: 1.7,
                        }}>
                            Nothing saved yet. Write something and press the save button.
                        </p>
                    </div>
                ) : (
                    entries.map(entry => (
                        <div
                            key={entry._id}
                            style={{
                                marginBottom: '12px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(180,140,100,0.1)',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                transition: 'border-color 0.2s',
                            }}
                            onMouseOver={e => (e.currentTarget.style.borderColor = 'rgba(180,140,100,0.22)')}
                            onMouseOut={e => (e.currentTarget.style.borderColor = 'rgba(180,140,100,0.1)')}
                        >
                            {/* Entry meta */}
                            <div style={{
                                padding: '10px 14px 6px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {/* Title */}
                                    <div style={{
                                        fontFamily: '"Special Elite", cursive',
                                        fontSize: '0.9rem',
                                        color: 'rgba(240,232,210,0.75)',
                                        letterSpacing: '0.04em',
                                        marginBottom: '3px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>{entry.title}</div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <span style={{
                                            fontFamily: '"Courier Prime", monospace',
                                            fontSize: '0.62rem',
                                            color: 'rgba(180,150,100,0.4)',
                                            letterSpacing: '0.05em',
                                        }}>{formatDate(entry.createdAt)}</span>
                                        <span style={{
                                            fontFamily: '"Courier Prime", monospace',
                                            fontSize: '0.58rem',
                                            color: 'rgba(180,150,100,0.25)',
                                        }}>{entry.pages.length} {entry.pages.length === 1 ? 'page' : 'pages'}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button
                                        onClick={() => onLoad(entry)}
                                        title="Load this entry"
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'rgba(180,150,100,0.3)',
                                            fontSize: '0.7rem', padding: '2px 6px',
                                            fontFamily: '"Special Elite", cursive',
                                            letterSpacing: '0.05em',
                                            transition: 'color 0.2s',
                                        }}
                                        onMouseOver={e => (e.currentTarget.style.color = 'rgba(180,150,100,0.7)')}
                                        onMouseOut={e => (e.currentTarget.style.color = 'rgba(180,150,100,0.3)')}
                                    >reload</button>
                                    <button
                                        onClick={() => onDelete(entry._id)}
                                        title="Delete"
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'rgba(200,100,80,0.25)',
                                            fontSize: '0.7rem', padding: '2px 4px',
                                            transition: 'color 0.2s',
                                        }}
                                        onMouseOver={e => (e.currentTarget.style.color = 'rgba(200,100,80,0.6)')}
                                        onMouseOut={e => (e.currentTarget.style.color = 'rgba(200,100,80,0.25)')}
                                    >✕</button>
                                </div>
                            </div>

                            {/* Entry text preview (first page) */}
                            <div style={{ padding: '2px 14px 10px' }}>
                                <p style={{
                                    fontFamily: '"Courier Prime", monospace',
                                    fontSize: '0.78rem',
                                    color: 'rgba(240,232,210,0.55)',
                                    lineHeight: 1.6,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {entry.pages.map(p => p.text).join('\n\n')}
                                </p>
                            </div>

                            {/* AI reply preview (if any) */}
                            {entry.aiReply && (
                                <div style={{
                                    padding: '8px 14px 10px',
                                    borderTop: '1px solid rgba(180,140,100,0.08)',
                                    background: 'rgba(255,255,255,0.02)',
                                }}>
                                    <div style={{
                                        fontFamily: '"Special Elite", cursive',
                                        fontSize: '0.6rem',
                                        letterSpacing: '0.15em',
                                        color: 'rgba(120,160,180,0.35)',
                                        textTransform: 'uppercase',
                                        marginBottom: '4px',
                                    }}>QuietInk replied</div>
                                    <p style={{
                                        fontFamily: '"Lora", serif',
                                        fontStyle: 'italic',
                                        fontSize: '0.75rem',
                                        color: 'rgba(200,190,165,0.38)',
                                        lineHeight: 1.55,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}>
                                        {entry.aiReply}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div style={{
                padding: '14px 24px',
                borderTop: '1px solid rgba(180,140,100,0.08)',
                fontFamily: '"Courier Prime", monospace',
                fontSize: '0.62rem',
                color: 'rgba(180,150,100,0.2)',
                textAlign: 'center',
                letterSpacing: '0.08em',
            }}>
                entries saved to server
            </div>
        </div>
    )
}