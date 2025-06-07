import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import plantService from '@/lib/services/plantService';

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: plant, isLoading } = useQuery({
    queryKey: ['plant', id],
    queryFn: () => plantService.getPlantById(Number(id)),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!plant) {
    return <div>Plant not found</div>;
  }

  return (
    <div className="container-custom py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <img
              src={plant.images[selectedImage]?.url}
              alt={plant.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {plant.images.map((image, index) => (
              <button
                key={index}
                className={`aspect-square relative overflow-hidden rounded-lg ${
                  selectedImage === index ? 'ring-2 ring-growmor-green-dark' : ''
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.url}
                  alt={`${plant.name} - Image ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-growmor-green-dark">{plant.name}</h1>
            <p className="text-2xl font-semibold mt-2">₹{plant.price}</p>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= (plant.averageRating || 0)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              ({plant.reviews?.length || 0} reviews)
            </span>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-gray-600">{plant.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Care Instructions</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-growmor-green-pale rounded-lg">
                <h3 className="font-medium mb-2">Light</h3>
                <p className="text-sm text-gray-600">{plant.light}</p>
              </div>
              <div className="p-4 bg-growmor-green-pale rounded-lg">
                <h3 className="font-medium mb-2">Water</h3>
                <p className="text-sm text-gray-600">{plant.water}</p>
              </div>
              <div className="p-4 bg-growmor-green-pale rounded-lg">
                <h3 className="font-medium mb-2">Temperature</h3>
                <p className="text-sm text-gray-600">{plant.temperature}</p>
              </div>
              <div className="p-4 bg-growmor-green-pale rounded-lg">
                <h3 className="font-medium mb-2">Humidity</h3>
                <p className="text-sm text-gray-600">{plant.humidity}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 pt-6">
            <Button className="flex-1 bg-growmor-green-dark hover:bg-growmor-green-dark/90">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        <div className="space-y-6">
          {plant.reviews?.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {review.user.name}
                </span>
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
