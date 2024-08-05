import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Edit, Trash2 } from 'lucide-react';

const fields = [
  { name: 'enquiry_id', type: 'text' },
  { name: 'channel', type: 'select', options: ['email', 'phone', 'website'] },
  { name: 'enquiry_mode', type: 'text' },
  { name: 'enquiry_type', type: 'text' },
  { name: 'enquiry_subtype', type: 'text' },
  { name: 'client', type: 'text' },
  { name: 'inco_terms', type: 'text' },
  { name: 'origin_country', type: 'text' },
  { name: 'origin_port', type: 'text' },
  { name: 'destination_country', type: 'text' },
  { name: 'destination_port', type: 'text' },
  { name: 'length', type: 'number' },
  { name: 'breadth', type: 'number' },
  { name: 'height', type: 'number' },
  { name: 'unit_of_measurement', type: 'text' },
  { name: 'package_type', type: 'text' },
  { name: 'no_of_pkgs', type: 'number' },
  { name: 'net_weight', type: 'number' },
  { name: 'gross_weight', type: 'number' },
  { name: 'equipment', type: 'text' },
  { name: 'no_of_units', type: 'number' },
  { name: 'commodity', type: 'text' },
  { name: 'cargo_readiness', type: 'date' },
  { name: 'cut_off_eta', type: 'date' },
  { name: 'indication_in_usd', type: 'text' },
  { name: 'remarks', type: 'text' },
];

const operators = [
  { value: 'equals', label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'startsWith', label: 'Starts with' },
  { value: 'endsWith', label: 'Ends with' },
  { value: 'greaterThan', label: 'Greater than' },
  { value: 'lessThan', label: 'Less than' },
];

const AdvancedSearch = ({ onSearch, savedSearches, onSaveSearch, onEditSearch, onDeleteSearch }) => {
  const [criteria, setCriteria] = useState([]);
  const [searchName, setSearchName] = useState('');

  const addCriterion = () => {
    setCriteria([...criteria, { field: fields[0].name, operator: 'equals', value: '' }]);
  };

  const removeCriterion = (index) => {
    const newCriteria = [...criteria];
    newCriteria.splice(index, 1);
    setCriteria(newCriteria);
  };

  const updateCriterion = (index, key, value) => {
    const newCriteria = [...criteria];
    newCriteria[index][key] = value;
    setCriteria(newCriteria);
  };

  const handleSearch = () => {
    onSearch(criteria);
  };

  const handleSaveSearch = () => {
    if (searchName) {
      onSaveSearch(searchName);
      setSearchName('');
    } else {
      alert('Please enter a name for your search');
    }
  };

  const loadSavedSearch = (savedSearch) => {
    const parsedCriteria = JSON.parse(savedSearch.criteria);
    setCriteria(parsedCriteria);
  };

  const handleEditSearch = (savedSearch) => {
    onEditSearch(savedSearch);
  };

  const handleDeleteSearch = (savedSearch) => {
    onDeleteSearch(savedSearch);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Advanced Search</CardTitle>
      </CardHeader>
      <CardContent>
        {criteria.map((criterion, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Select value={criterion.field} onValueChange={(value) => updateCriterion(index, 'field', value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {fields.map((field) => (
                  <SelectItem key={field.name} value={field.name}>
                    {field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={criterion.operator} onValueChange={(value) => updateCriterion(index, 'operator', value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fields.find(f => f.name === criterion.field)?.type === 'date' ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    {criterion.value ? new Date(criterion.value).toDateString() : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={criterion.value ? new Date(criterion.value) : undefined}
                    onSelect={(date) => updateCriterion(index, 'value', date?.toISOString())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : fields.find(f => f.name === criterion.field)?.type === 'select' ? (
              <Select value={criterion.value} onValueChange={(value) => updateCriterion(index, 'value', value)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select value" />
                </SelectTrigger>
                <SelectContent>
                  {fields.find(f => f.name === criterion.field)?.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={fields.find(f => f.name === criterion.field)?.type || 'text'}
                value={criterion.value}
                onChange={(e) => updateCriterion(index, 'value', e.target.value)}
                placeholder="Enter value"
              />
            )}
            <Button variant="ghost" size="icon" onClick={() => removeCriterion(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex space-x-2 mt-4">
          <Button onClick={addCriterion}>Add Criterion</Button>
          <Button onClick={handleSearch}>Search</Button>
          <Input
            type="text"
            placeholder="Search name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Button onClick={handleSaveSearch}>Save Search</Button>
        </div>
        {savedSearches.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Saved Searches</h3>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map((savedSearch, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => loadSavedSearch(savedSearch)}>
                    {savedSearch.name}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEditSearch(savedSearch)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteSearch(savedSearch)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
