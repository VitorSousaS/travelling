import { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
// import required modules
import { Navigation } from "swiper/modules";
import { AttractionType, EstablishmentType } from "../../../interfaces";
import { AttractionCard, EstablishmentCard, SwitchComponents } from "../..";
import { reorder } from "../../../services";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  DropResult,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { Popconfirm } from "antd";

interface SnapCarouselReorderProps {
  name: string;
  locals: (AttractionType | EstablishmentType)[];
  onChange: (ordereds: (AttractionType | EstablishmentType)[]) => void;
  onRemoveLocal: (removeLocal: AttractionType | EstablishmentType) => void;
  isReorderMode: boolean;
}

const DraggableContainer: React.FC<SnapCarouselReorderProps> = ({
  locals,
  onChange,
  onRemoveLocal,
}) => {
  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
  ): React.CSSProperties => ({
    // change background colour if dragging
    userSelect: "none",
    background: isDragging ? "transparent" : "transparent",
    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "#b6d7ed" : "transparent",
    borderRadius: "0.5rem",
  });

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const locals_reordered = reorder(
      locals,
      result.source.index,
      result.destination.index
    );

    onChange(locals_reordered);
  };

  return (
    <div className="w-full relative">
      {locals.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="localId" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                className="flex items-center gap-8"
                {...provided.droppableProps}
              >
                {locals.map((item, index) => (
                  <Draggable draggableId={item.id} key={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                        className="mb-8 w-80 h-80 xs:w-60 xs:h-60 sm:w-60 sm:h-60"
                      >
                        <SwitchComponents active={item.type}>
                          <AttractionCard
                            name="attraction"
                            card={item as AttractionType}
                          />
                          <EstablishmentCard
                            name="establishment"
                            card={item as EstablishmentType}
                          />
                        </SwitchComponents>

                        <div className="w-full flex items-center justify-center mt-2">
                          <Popconfirm
                            title="Remover local"
                            description={`Deseja realmente remover ${item.name} de seu StoryTravelling?`}
                            onConfirm={() => onRemoveLocal(item)}
                            placement="bottom"
                            okText="Sim"
                            cancelText="Não"
                          >
                            <i
                              className="fa-solid fa-trash text-xl text-auxiliary-error transition duration-200 hover:cursor-pointer hover:opacity-80"
                              onClick={(event) => {
                                event.stopPropagation();
                              }}
                            />
                          </Popconfirm>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

const CarouselContainer: React.FC<SnapCarouselReorderProps> = ({
  locals,
  onRemoveLocal,
}) => {
  const [swiperRef, setSwiperRef] = useState<any | null>(null);

  return (
    <div className="w-full relative">
      {locals.length > 0 && (
        <Swiper
          slidesPerView="auto"
          spaceBetween={32}
          modules={[Navigation]}
          onSwiper={(swiper) => setSwiperRef(swiper)}
          className="overflow-y-visible"
        >
          <button
            className="absolute h-full right-0 top-1/2 rounded-lg -translate-y-1/2 transition duration-500 hover:bg-[#000] hover:opacity-40 z-10 text-auxiliary-beige"
            onClick={() => swiperRef.slideNext()}
          >
            <i className="fa-solid fa-chevron-right px-4 text-3xl text-secondary-light" />
          </button>
          {locals.map((item) => (
            <SwiperSlide
              key={item.id}
              className="mb-8 w-80 h-80 xs:w-60 xs:h-60 sm:w-60 sm:h-60 transform transition duration-500 hover:scale-110 hover:cursor-pointer"
            >
              <SwitchComponents active={item.type}>
                <AttractionCard
                  name="attraction"
                  card={item as AttractionType}
                />
                <EstablishmentCard
                  name="establishment"
                  card={item as EstablishmentType}
                />
              </SwitchComponents>
              <div className="w-full flex items-center justify-center mt-2">
                <Popconfirm
                  title="Remover local"
                  description={`Deseja realmente remover ${item.name} de seu StoryTravelling?`}
                  onConfirm={() => onRemoveLocal(item)}
                  placement="bottom"
                  okText="Sim"
                  cancelText="Não"
                >
                  <i
                    className="fa-solid fa-trash text-xl text-auxiliary-error transition duration-200 hover:cursor-pointer hover:opacity-80"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  />
                </Popconfirm>
              </div>
            </SwiperSlide>
          ))}
          <button
            className="absolute h-full left-0 top-1/2 rounded-lg -translate-y-1/2 transition duration-500 hover:bg-[#000] hover:opacity-40 z-10 text-auxiliary-beige"
            onClick={() => swiperRef.slidePrev()}
          >
            <i className="fa-solid fa-chevron-left px-4 text-3xl text-secondary-light" />
          </button>
        </Swiper>
      )}
    </div>
  );
};

export const SnapCarouselReorder: React.FC<SnapCarouselReorderProps> = (
  props
) => {
  return (
    <div className="w-full relative">
      {props.isReorderMode ? (
        <DraggableContainer {...props} />
      ) : (
        <CarouselContainer {...props} />
      )}
    </div>
  );
};
