import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';

export default function NotesWidget() {
  const notes = useStore((state) => state.notes);
  const setNotes = useStore((state) => state.setNotes);
  const [draft, setDraft] = useState(notes);

  useEffect(() => {
    setDraft(notes);
  }, [notes]);

  return (
    <section className="widget notes-widget">
      <div className="widget-header">
        <div>
          <p className="widget-eyebrow">Quick notes</p>
          <h3>All notes</h3>
        </div>
      </div>

      <textarea
        className="notes-input"
        value={draft}
        onChange={(event) => {
          const nextValue = event.target.value;
          setDraft(nextValue);
          setNotes(nextValue);
        }}
        placeholder="Write anything you want to remember..."
      />
    </section>
  );
}