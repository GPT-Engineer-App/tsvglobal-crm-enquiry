import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const QuoteOfTheDay = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();
        setQuote(data.content);
        setAuthor(data.author);
      } catch (error) {
        console.error('Error fetching quote:', error);
        setQuote('The best preparation for tomorrow is doing your best today.');
        setAuthor('H. Jackson Brown Jr.');
      }
    };

    fetchQuote();
  }, []);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <p className="text-lg font-semibold">Quote of the Day</p>
        <p className="italic">"{quote}"</p>
        <p className="text-right">- {author}</p>
      </CardContent>
    </Card>
  );
};

export default QuoteOfTheDay;
