module Api
	module V1
		class TagsController < ApplicationController
			protect_from_forgery with: :null_session
				
			def index
				tags = Tag.all

				render json: TagSerializer.new(tags).serializable_hash.to_json
			end

			def show
				tag = Tag.find_by(id: params[:id])

				render json: TagSerializer.new(tag).serializable_hash.to_json
			end

			def create
				tag = Tag.new(tag_params)
        if tag.save
          render json: TagSerializer.new(tag).serializable_hash.to_json
        else
          render json: { error: tag.errors.messages }, status: 422
        end
			end

			def update
        tag = Tag.find_by(id: params[:id])
        if tag.update(tag_params)
          render json: TagSerializer.new(tag).serializable_hash.to_json
        else
          render json: { error: tag.errors.messages }, status: 422
        end
      end

			def destroy
        tag = Tag.find_by(id: params[:id])
        if tag.destroy
          head :no_content
        else
          render json: { errors: tag.errors }, status: 422
        end
      end
			
			private

			def tag_params
				params.require(:tag).permit(:name, :task_id)
			end

		end
	end
end