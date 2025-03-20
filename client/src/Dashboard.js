import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostListingForm from './PostListingForm';
import './Dashboard.css';

function Dashboard({ name, email, onLogout }) {
    const [showForm, setShowForm] = useState(false);
    const [listings, setListings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get('/search?query=');
                setListings(response.data.listings || []);
                setFilteredResults(response.data.listings || []);
                setError('');
            } catch (error) {
                console.error('Error fetching listings:', error);
                setError('Failed to load listings. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchListings();
    }, []);

    // Handle search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredResults(listings);
            return;
        }

        const filtered = listings.filter(listing =>
            listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.size?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.itemType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.condition?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredResults(filtered);
    }, [searchQuery, listings]);

    // Function to render placeholder content when no listings are available
    const renderPlaceholderContent = () => {
        // Sample placeholder data for visual testing
        const placeholders = [
            {
                id: 'placeholder-1',
                title: 'Blue Denim Jacket',
                size: 'M',
                itemType: 'Jacket',
                pricePerDay: '5.99',
                imageURL: 'https://via.placeholder.com/300x200?text=Denim+Jacket'
            },
            {
                id: 'placeholder-2',
                title: 'Black Jeans',
                size: 'L',
                itemType: 'Jeans',
                pricePerDay: '3.50',
                imageURL: 'https://via.placeholder.com/300x200?text=Black+Jeans'
            },
            {
                id: 'placeholder-3',
                title: 'Summer Dress',
                size: 'S',
                itemType: 'Dress',
                pricePerDay: '6.00',
                imageURL: 'https://via.placeholder.com/300x200?text=Summer+Dress'
            }
        ];

        return (
            <div className="listings-grid">
                {placeholders.map((item) => (
                    <div key={item.id} className="listing-card">
                        <img src={item.imageURL} alt={item.title} />
                        <div className="listing-info">
                            <h3>{item.title}</h3>
                            <p><strong>Size:</strong> {item.size}</p>
                            <p><strong>Type:</strong> {item.itemType}</p>
                            <p><strong>${item.pricePerDay}/day</strong></p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="dashboard">
            <h2>Welcome, {name}!</h2>

            {/* Search Bar */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search by title, size, type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Toggle Post Listing Form */}
            <button className="post-listing-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "Post a Listing"}
            </button>

            {/* Show Post Listing Form */}
            {showForm && <PostListingForm email={email} onClose={() => setShowForm(false)} />}

            {/* Listings Grid */}
            {!showForm && (
                <>
                    {isLoading ? (
                        <p className="status-message">Loading listings...</p>
                    ) : error ? (
                        <div className="error-container">
                            <p className="error-message">{error}</p>
                            {renderPlaceholderContent()}
                        </div>
                    ) : filteredResults.length > 0 ? (
                        <div className="listings-grid">
                            {filteredResults.map((listing) => (
                                <div key={listing.id} className="listing-card">
                                    <img 
                                        src={listing.imageURL || "https://via.placeholder.com/300x200?text=No+Image"} 
                                        alt={listing.title} 
                                    />
                                    <div className="listing-info">
                                        <h3>{listing.title}</h3>
                                        <p><strong>Size:</strong> {listing.size}</p>
                                        <p><strong>Type:</strong> {listing.itemType}</p>
                                        <p><strong>${listing.pricePerDay}/day</strong></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchQuery ? (
                        <p className="status-message">No items matching "{searchQuery}" found.</p>
                    ) : (
                        <div>
                            <p className="status-message">No listings available. Be the first to post!</p>
                            {renderPlaceholderContent()}
                        </div>
                    )}
                </>
            )}

            {/* Logout Button */}
            <button className="logout-btn" onClick={onLogout}>Log Out</button>
        </div>
    );
}

export default Dashboard;