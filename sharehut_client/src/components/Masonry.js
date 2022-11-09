import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';



const MasonryGrid = ({pins}) => {
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
      };

    return (
        <div>
            <Masonry breakpointCols={breakpointColumnsObj} className="flex animate-slide-fwd" >
{ pins.map(pin => ( <Pin key={pin?._id} pin={pin}/> )) }

</Masonry>
        </div>
    );
};

export default MasonryGrid;