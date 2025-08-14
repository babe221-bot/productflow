import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();
  const mockOnFilterChange = jest.fn();
  
  const defaultProps = {
    placeholder: 'Search equipment...',
    onSearch: mockOnSearch,
    onFilterChange: mockOnFilterChange,
    filters: [
      { value: 'operational', label: 'Operational' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'warning', label: 'Warning' },
    ],
    suggestions: ['Machine 1', 'Machine 2', 'Machine 3'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input with placeholder', () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search equipment...');
    expect(searchInput).toBeInTheDocument();
  });

  test('calls onSearch when typing in search input', async () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search equipment...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Wait for debounce
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  test('shows suggestions when typing', async () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search equipment...');
    fireEvent.change(searchInput, { target: { value: 'Machine' } });
    
    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('Machine 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Machine 2')).toBeInTheDocument();
    expect(screen.getByText('Machine 3')).toBeInTheDocument();
  });

  test('calls onSearch when suggestion is selected', async () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search equipment...');
    fireEvent.change(searchInput, { target: { value: 'Machine' } });
    
    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('Machine 1')).toBeInTheDocument();
    });
    
    const suggestion = screen.getByText('Machine 1');
    fireEvent.click(suggestion);
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Machine 1');
    });
  });

  test('renders filter chips when showFilters is true', () => {
    render(<SearchBar {...defaultProps} showFilters={true} />);
    
    expect(screen.getByText('Operational')).toBeInTheDocument();
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  test('calls onFilterChange when filter is toggled', () => {
    render(<SearchBar {...defaultProps} showFilters={true} />);
    
    const operationalFilter = screen.getByText('Operational');
    fireEvent.click(operationalFilter);
    
    expect(mockOnFilterChange).toHaveBeenCalledWith(['operational']);
  });

  test('clears search input when clear button is clicked', () => {
    render(<SearchBar {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search equipment...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    expect(searchInput).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('does not render filter chips when showFilters is false', () => {
    render(<SearchBar {...defaultProps} showFilters={false} />);
    
    expect(screen.queryByText('Operational')).not.toBeInTheDocument();
    expect(screen.queryByText('Maintenance')).not.toBeInTheDocument();
    expect(screen.queryByText('Warning')).not.toBeInTheDocument();
  });
});