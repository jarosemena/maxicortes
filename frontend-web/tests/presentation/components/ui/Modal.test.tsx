import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../utils/test-utils';
import { Modal } from '../../../../src/presentation/components/ui/Modal';

describe('Modal Component', () => {
  it('should not render when open is false', () => {
    render(
      <Modal open={false} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.queryByText(/modal content/i)).not.toBeInTheDocument();
  });

  it('should render when open is true', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByText(/modal content/i)).toBeInTheDocument();
  });

  it('should call onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    const backdrop = document.querySelector('.MuiBackdrop-root');
    fireEvent.click(backdrop!);
    
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('should call onClose when escape key is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('should not close on backdrop click when disableBackdropClick is true', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} disableBackdropClick>
        <div>Modal Content</div>
      </Modal>
    );
    
    const backdrop = document.querySelector('.MuiBackdrop-root');
    fireEvent.click(backdrop!);
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should not close on escape key when disableEscapeKeyDown is true', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} disableEscapeKeyDown>
        <div>Modal Content</div>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('should render with title', () => {
    render(
      <Modal open={true} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    
    expect(screen.getByText(/test modal/i)).toBeInTheDocument();
  });

  it('should render with close button when showCloseButton is true', () => {
    const handleClose = vi.fn();
    render(
      <Modal open={true} onClose={handleClose} showCloseButton>
        <div>Modal Content</div>
      </Modal>
    );
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(
      <Modal open={true} onClose={() => {}} size="small">
        <div>Small Modal</div>
      </Modal>
    );
    
    let dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('MuiDialog-paperWidthSm');

    rerender(
      <Modal open={true} onClose={() => {}} size="medium">
        <div>Medium Modal</div>
      </Modal>
    );
    
    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('MuiDialog-paperWidthMd');

    rerender(
      <Modal open={true} onClose={() => {}} size="large">
        <div>Large Modal</div>
      </Modal>
    );
    
    dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('MuiDialog-paperWidthLg');
  });

  it('should render fullScreen when specified', () => {
    render(
      <Modal open={true} onClose={() => {}} fullScreen>
        <div>Full Screen Modal</div>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('MuiDialog-paperFullScreen');
  });

  it('should render with actions', () => {
    const actions = (
      <div>
        <button>Cancel</button>
        <button>Save</button>
      </div>
    );

    render(
      <Modal open={true} onClose={() => {}} actions={actions}>
        <div>Modal with Actions</div>
      </Modal>
    );
    
    expect(screen.getByText(/cancel/i)).toBeInTheDocument();
    expect(screen.getByText(/save/i)).toBeInTheDocument();
  });

  it('should have correct accessibility attributes', () => {
    render(
      <Modal 
        open={true} 
        onClose={() => {}} 
        title="Accessible Modal"
        aria-describedby="modal-description"
      >
        <div id="modal-description">This is an accessible modal</div>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
  });

  it('should focus on first focusable element when opened', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <div>
          <button>First Button</button>
          <button>Second Button</button>
        </div>
      </Modal>
    );
    
    const firstButton = screen.getByText(/first button/i);
    expect(firstButton).toHaveFocus();
  });

  it('should trap focus within modal', () => {
    render(
      <Modal open={true} onClose={() => {}}>
        <div>
          <button>First Button</button>
          <button>Last Button</button>
        </div>
      </Modal>
    );
    
    const firstButton = screen.getByText(/first button/i);
    const lastButton = screen.getByText(/last button/i);
    
    // Tab from last button should go to first button
    lastButton.focus();
    fireEvent.keyDown(lastButton, { key: 'Tab' });
    
    expect(firstButton).toHaveFocus();
  });
});